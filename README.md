# Final Project : TicketNest

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/e0ff6101-8702-4591-bb5a-3bbb54d909fa">

## 프로젝트 소개

대용량 트래픽 핸들링을 타겟팅한 티겟팅 예매 소셜 이커머스입니다.

최근 온라인 서비스의 규모가 커지고 지속적으로 서버가 확장됨에 따라 운영 비용은 최소화하고 동시에 대규모 트래픽은 효율적으로 관리하고자 하는 기업이 늘어나고 있습니다.

이에 따라, 현재의 트랜드를 따라가기 위해 제한된 조건을 가지고 동시성 제어, 확장성 및 고가용성을 우선시하는 시스템을 설계해보고자 시장 조사를 해본 결과 "티겟팅 서비스" 가 저희가 생각한 환경과 가장 유사하며 접근성이 좋은 주제이고, 순간적 or 지속적인 대용량 트래픽을 핸들링 하기에 적합하다고 생각하여 선택하게 되었습니다.

## 서비스 아키텍처

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/be92030e-4ba2-4bf5-80d6-45a6f6e96f76" width="75%">

## ERD

<img src="https://github.com/tkdgks7036/prac_code_JS/assets/133713235/61d7d574-c72d-4593-9913-b1174a8bd65b" width="75%">

## 기술적 의사 결정

<details>
<summary><b>NestJS ( 추가필요 )</b></summary>
- 내용 1<br>
- 내용 2<br>
- 내용 3<br>
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
<summary><b>EC2 Instance 간 연결</b></summary>

**`❗  Issue`**
- 인바운드 규칙을 설정했음에도 불구, 애플리케이션과 데이터베이스의 연결 실패

**`💡  Solution`**
- Public IPv4 / Private IPv4 차이점을 활용
- 도커 컨테이너의 -p 옵션을 통해 호스트와 별도의 네트워크 연결 처리

</details>

<details>
<summary><b>데이터 동시성 제어</b></summary>

**`❗  Issue`**
- 다수의 사용자가 API에 동시에 접근할 경우 데이터의 일관성이 지켜지지 않는 현상

**`💡  Solution`**
- goods_entity 테이블에 BookingCount라는 새로운 Column을 생성하여 Write Lock을 걸어 Row 수준에서의 Lock 진행
- 이를 통해 API에 다수의 사용자가 동시에 접근했을 때 순차적으로 예매할 수 있도록 설정

</details>

<details>
<summary><b>로드밸런서 최적화</b></summary>

**`❗  Issue`**
- 부하 테스트 중 504 Gateway Time-out Error

**`💡  Solution`**
- 한 서버가 다른 서버로부터 제때 응답을 받지 못했기 때문에 로드 밸런서의 timeout 값 설정을 통해 자체 대기 시간 및 리소스 제한 해결

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
