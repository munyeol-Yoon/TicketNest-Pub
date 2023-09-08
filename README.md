# Final Project : TicketNest

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/e0ff6101-8702-4591-bb5a-3bbb54d909fa">

## 프로젝트 소개

대용량 트래픽 핸들링을 타겟팅한 티겟팅 예매 소셜 이커머스입니다.

최근 온라인 서비스의 규모가 커지고 지속적으로 서버가 확장됨에 따라 운영 비용은 최소화하고 동시에 대규모 트래픽은 효율적으로 관리하고자 하는 기업이 늘어나고 있습니다.

이에 따라, 현재의 트랜드를 따라가기 위해 제한된 조건을 가지고 동시성 제어, 확장성 및 고가용성을 우선시하는 시스템을 설계해보고자 시장 조사를 해본 결과 "티겟팅 서비스" 가 저희가 생각한 환경과 가장 유사하며 접근성이 좋은 주제이고, 순간적 or 지속적인 대용량 트래픽을 핸들링 하기에 적합하다고 생각하여 선택하게 되었습니다.

FE-Repository : https://github.com/TicketNest/TicketNest-FE

Pub-Repository : https://github.com/TicketNest/TicketNest-Pub

Sub-Repository : https://github.com/TicketNest/TicketNest-sub

## 서비스 아키텍처

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/be92030e-4ba2-4bf5-80d6-45a6f6e96f76">

## ERD

``
<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/61d7d574-c72d-4593-9913-b1174a8bd65b" width="75%">

## 기술적 의사 결정

| 사용 기술                | 기술 설명                                         |
| ------------------------ | ------------------------------------------------- |
| **NestJS**               | - 몰더 및 파일 구조를 잡아줌 </br>- 컴파일 단계에서 에러를 미리 발견할 수 있어 생산성 향상 </br>- 데이터 타입을 지정할 수 있어 개발자가 기대한 결과값과 다른 값이 반환되는 현상 방지 </br> - 회사의 선호도   |
| **postgreSQL & TypeORM** | - 대용량 트래픽을 제어할 때 데이터 읽기만 하는 것이 아니라 쓰는 것도 고려해야함 </br> - PostgreSQL은 테이블 간 복잡한 쿼리를 처리함에 있어 이점이 있음 </br> - PostgreSQL 은 ACID 속성 지원함  </br> - TypeORM 은 NestJS 공식 ORM 의 안정적 지원 및 준수한 성능 |
| **Redis**                | - 높은 처리속도 </br> - Pub/Sub 과 In-Memory 캐싱 기술 </br> - 시스템 운용 범위가 줄어듬 |
| **nGrinder**             | - 비교적 쉬운 설치 과정과 요소들로 구성 </br> - 국내 커뮤니티 존재 </br> -  </br> - 내용4 |
| **Elastic APM**          | - 트랜잭션에 소요되는 시간 학인 가능 </br> - 병목 현상 파악 |
| **HAPROXY & Pgpool-II**  | - 부하를 균등하게 맞추기 위해 사용 </br> - 내용2 </br> - 내용3 </br> - 내용4 |
| **AWS**                  | - AWS의 다양한 서비스를 통해 아키텍처의 확장을 쉽게 할 수 있음 </br> - 회사의 선호도 </br> - 내용3 </br> - 내용4 |

## Trouble Shooting

<details>
<summary><b>EC2 인스턴스 간 연결</b></summary>

**`❗  Issue`**

- 애플리케이션 Instance -> PostgreSQL Instance 연결 실패

**`💦Try`**

- 에러메시지에 나온 IP 주소 값을 인바운드 규칙에 추가

  - → 에러에 나온 주소의 출처는 엔드포인트의 IP로, 인바운드 규칙에 추가해 봤지만 연결에 실패하였다.

- Docker에서 나오는 IP 주소 값을 인바운드 규칙에 추가

  - → Docker의 Gateway, Container 등 내부 IP 주소 값을 추가해도 연결에 실패하였다.

- ✅ Docker를 생성할 때 -p 옵션을 통한 IP 주소 설정

  - → 포트 번호만 설정하지 않고, 접근하고자 하는 IP주소 값까지 설정

```
** 기존 시행착오
sudo docker run --name ticketnest -d -p 8080:8080 munyeolyoon/ticketnest

** 수정 후 시행착오
sudo docker run --name ticketnest -d -p <IP Address>:8080:8080 munyeolyoon/ticketnest
```


**`💡  Solution`**

- 인바운드 규칙을 통해 Instance에 접근 권한을 준 것은 ipv4 이다.
- -p 옵션을 통해 호스트 IP 주소를 연결하고자 하는 Instance의 public ipv4로 설정하였다.
- 호스트 IP 주소를 설정할 때, Public과 Private 중 무엇을 설정해야 할지 잘 생각해 봐야 했다.
    - Public IPv4: 외부 네트워크에서 인스턴스로의 연결을 도와주는 주소로써. 인스턴스를 중지하고 재시작할 경우 IPv4 값이 변경될 수 있다.
    - Private IPv4: VPC 또는 로컬 네트워크 내에서만 인스턴스에 연결할 수 있도록 도와주는 주소이다.

</details>

<details>
<summary><b>데이터 동시성 제어</b></summary>

**`❗  Issue`**

- 다수의 User가 동시 접속 시 데이터 일관성이 지켜지지 않는 상태 발생

**`💦Try`**

- Transaction 을 적용하여 Test 진행
  - 다수의 사용자가 동일한 BookingCount를 받는 현상 유지, 따라서 데이터 일관성이 깨지는 현상 발생

- Transaction Level 변경하여 진행
  - READ COMMITED와 REPETABLE READ의 경우 다수의 사용자가 동일한 BookingCount를 받는 현상 유지, SERIALIZABLE의 경우 가장 높은 격리 수준으로 동시성이 떨어지는 문제가 발생 

- TypeORM Count Method에 Lock을 Read Lock or Write Lock을 설정해 동시성 제어 시도
  - Count Method에는 Table Locks 수준을 걸어야 하기에, 비관적 락이 걸리지 않는 문제점 발생

```
const count: number = await queryRunner.manager.count(BookingEntity, {
  where : { id : goodsId },
	lock : { mode : 'pessimistic_write' },
});
```

- ✅ Goods Table에 BookingCount Column을 새로 생성하고, 해당 Row에 Write Lock을 걸어 동시성 제어 진행
  - Write Lock을 걸어 Row 수준에서의 잠금을 진행하고 다수의 User가 동시적으로 접근해도 순차적으로 예매가 가능

```
const findGoods = await queryRunner.manager.findOne(Goods, {
  where: { id: goodsId },
  // lock 수준을 배타락으로 설정
  lock: { mode: 'pessimistic_write' },
});
```


**`💡  Solution`**

- Transaction은 Read COMMITED로 설정하고, Find Method에 Write Lock을 걸어 동시성을 제어한다.
  -  더 높은 Isolate Level이나, Read Lock(공유락)을 설정 시 DeadLock 현상이 발생하는 문제점

- Count Method는 Row수준의 Lock이 걸리지 않는 부분을 확인하였다
  -  Table 전체를 조회하여 해당하는 Row의 갯수를 Count하기 때문에 Row 수준의 Lock은 걸리지 않는다.

- 따라서, Goods Table에 BookingCount Column을 추가한 뒤, 해당 Row에 Write Lock을 적용하였다.

- Transaction을 설정할 때, Transaction의 원리, Lock의 종류 등을 잘 생각하여 적용해야 한다 특히, 다수의 Transaction을 도식화하면서 분석하면, 더욱 빠르게 해법을 찾을 수 있다.

</details>

<details>
<summary><b>504 Gateway Time-out Error</b></summary>

**`❗  Issue`**

- 약 VUser 3500 / Run Count 1000 이상의 부하조건에서 504 Gateway Time-Out Error 발생

**`💦Try`**

- 로드 밸런서의 Timeout 시간을 늘려 에러를 줄였지만 해결책은 아니었음

- 로드 밸런서의 디스크 I/O 작업량이 많은 것을 확인
  - 로드 밸런서의 로그 기록 테스크를 제거한 후 다시 테스트 진행


**`💡  Solution`**



</details>

## 기술스택

| 분류         | 기술                                                                                                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language     | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">                                                                                                      |
| FrameWork    | <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">                                                                                                                                                                                                                             |
| DB & ORM     | <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/repmgr-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/typeorm-512BD4?style=for-the-badge&logo=typeorm&logoColor=white"> |
| Caching      | <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/bulljs-004088?style=for-the-badge&logo=bulljs&logoColor=white">                                                                                                                        |
| Monitor      | <img src="https://img.shields.io/badge/-Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white"> <img src="https://img.shields.io/badge/-kibana-005571?style=for-the-badge&logo=kibana&logoColor=white">                                                                                                      |
| Test         | <img src="https://img.shields.io/badge/ngrinder-ff7f00?style=for-the-badge&logo=ngrinder&logoColor=white">                                                                                                                                                                                                                         |
| Cloud & OS   | <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"> <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white">                                                                                                              |
| Load Balance | <img src="https://img.shields.io/badge/haproxy-E95420?style=for-the-badge&logo=haproxy&logoColor=white"> <img src="https://img.shields.io/badge/pgpool-E95420?style=for-the-badge&logo=pgpool&logoColor=white">                                                                                                                    |
| Etc          | <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white">                                                                                                        |
