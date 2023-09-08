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

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/4bcbb734-ca43-4778-bbfe-df0c5c237ebd" width="75%">

## ERD

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/61d7d574-c72d-4593-9913-b1174a8bd65b" width="75%">

## 기술적 의사 결정

<details>
<summary><b>NestJS </b></summary>
- 몰더 및 파일 구조를 잡아줌<br>
- 컴파일 단계에서 에러를 미리 발견할 수 있어 생산성 향상<br>
- 데이터 타입을 지정할 수 있어 개발자가 기대한 결과값과 다른 값이 반환되는 현상 방지<br>
</details>

<details>
<summary><b>PostgreSQL</b></summary>

* 오픈소스 기반 및 다양한 레퍼런스
* 프로젝트 주제의 특성상 읽기 작업 못지않은 대량의 쓰기 작업
* 추후 프로젝트 확장 및 테이블 관계의 복잡성에 대한 성능 보장<br>

</details>


<details>
<summary><b>TypeORM</b></summary>

* 쿼리의 복잡도가 상승함에 따른 가독성 및 성능 고려
* 데이터 무결성을 위해 흐름 제어에 필요한 ACID 속성 지원
* NestJS의 공식 ORM으로써 안정적인 지원과 준수한 성능<br>
</details>

<details>
<summary><b>Redis</b></summary>

* 메세지를 기록하지 않는 대신 높은 처리 속도 보장
* 다양한 레퍼런스와 Learning Curve
* Pub/Sub과 인메모링 캐싱 기술을 하나로 사용함에 따라 운용 범위 축소<br>
</details>

<details>
<summary><b>nGrinder</b></summary>

* 비교적 쉬운 설치 및 구성
* 국내 커뮤니티 및 다양한 레퍼런스 존재
* 여러 대의 Agent를 사용하여 대규모 부하 테스트 진행 가능<br>
</details>

<details>
<summary><b>Elastic APM ( 추가필요 )</b></summary>

* 작업 처리 소요 시간에 대한 자세한 가시화 데이터
* 병목 현상 지점 파악 용이
* Transaction에 소요되는 시간 체크<br>
</details>

<details>
<summary><b>HAPROXY( 추가필요 )</b></summary>

* 내용 1
* 내용 2
* 내용 3<br>
</details>

<details>
<summary><b>Pgpool-II ( 추가필요 )</b></summary>

* 내용 1
* 내용 2
* 내용 3<br>
</details>

## Trouble Shooting

<details>
<summary><b>EC2 인스턴스 간 연결</b></summary>

**`❗  Issue`**

- 애플리케이션 Instance -> PostgreSQL Instance 연결 실패

**`💡  Solution`**
- Public IPv4 / Private IPv4 차이점을 활용
- 도커 컨테이너의 -p 옵션을 통해 호스트와 별도의 네트워크 연결 처리<br>

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


**`💡  Solution`**
- goods_entity 테이블에 BookingCount라는 새로운 Column을 생성하여 Write Lock을 걸어 Row 수준에서의 Lock 진행
- 이를 통해 API에 다수의 사용자가 동시에 접근했을 때 순차적으로 예매할 수 있도록 설정<br>

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

**`💡  Solution`**
- 한 서버가 다른 서버로부터 제때 응답을 받지 못했기 때문에 로드 밸런서의 timeout 값 설정을 통해 자체 대기 시간 및 리소스 제한 해결<br>



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
