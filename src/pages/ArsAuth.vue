<template>
  <div class="wrap">
    <header>
      <div class="title">FinPick</div>
      <div class="ars_message">ARS 인증 진행 중</div>
    </header>
    <div class="container">
      <div class="content">
        <!-- 휴대폰 번호 입력 -->
        <div class="form_group">
          <label for="phone" class="label_text">휴대폰 번호</label>
          <input type="tel" id="phone" placeholder="휴대폰 번호를 입력하세요" />
          <label class="small">• 본인 명의의 휴대폰 번호를 입력해주세요</label>
        </div>

        <!-- 통신사 선택 -->
        <div class="form_group">
          <label class="label_text">통신사</label>
          <div class="carrier_options">
            <button>SKT</button>
            <button>KT</button>
            <button>LG U+</button>
          </div>
        </div>

        <!-- 이름 입력 -->
        <div class="form_group">
          <label for="name" class="label_text">이름</label>
          <input type="text" id="name" placeholder="이름을 입력하세요" />
        </div>

        <!-- 생년월일 입력 -->
        <div class="form_group">
          <label for="birthday" class="label_text">생년월일</label>
          <input type="text" id="birthday" placeholder="YYYY.MM.DD" />
          <label class="small_2"
            >• 주민등록증상의 생년월일을 입력해주세요</label
          >
        </div>

        <!-- 인증 요청 버튼 -->
        <div class="form_group">
          <button class="confirm_button">ARS 인증 요청</button>
          <p class="helper_text">인증 요청 시 ARS 전화가 발신됩니다</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>
<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  background: #fff;
  margin: 0;
  padding: 0;
}
.wrap {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  background: #fff;
  margin: 0;
  padding: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.title {
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(to right, #4318d1 0%, #8e74e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.ars_message {
  color: #666666;
  margin-bottom: 2rem;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.form_group {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
input {
  width: 100%;
  height: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 0 1rem;
  font-size: 1rem;
  background: #fff;
  box-sizing: border-box;
}
.carrier_options {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}
.carrier_options button {
  flex: 1;
  height: 48px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  font-size: 1rem;
  color: #333;
}
.confirm_button {
  width: 100%;
  height: 58px;
  border: none;
  border-radius: 10px;
  background: #8e74e3;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.helper_text {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}
.label_text {
  text-align: left;
  font-size: 1rem;
  color: #333333;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.small,
.small_2 {
  text-align: left;
  font-size: 0.8rem;
  color: #666666;
  margin-top: 0.2rem;
}
@media (min-width: 541px) {
  html,
  body,
  .wrap {
    width: 540px;
    height: 960px;
    min-width: 540px;
    min-height: 960px;
    margin: 0 auto;
    background: #fff;
  }
}
</style>
