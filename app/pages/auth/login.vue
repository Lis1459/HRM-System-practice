<script setup lang="ts">
import { Form } from "@primevue/forms";
</script>
<template>
  <div class="login">
    <h1 class="login__title">Welcome back</h1>
    <p class="login__subtitle">Hello again! Log in to continue</p>
    <Form v-slot="$form" class="form">
      <AppFloatLabel label="Email" input-id="email" class="from__email-input">
        <template #default="{ inputId }">
          <InputText :id="inputId" fluid />
        </template>
      </AppFloatLabel>
      <AppFloatLabel
        label="Password"
        input-id="password"
        class="from__password-input"
      >
        <template #default="{ inputId }">
          <Password :id="inputId" toggle-mask :feedback="false" fluid />
        </template>
      </AppFloatLabel>
      <div class="form__button-set">
        <AppButton label="LOG IN" class="form__button" button-type="submit" />
        <AppButton
          label="FORGOT PASSWORD"
          variant="text"
          class="form__button"
        />
      </div>
    </Form>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 560px;
  height: 100%;
}

.login__title {
  font-weight: 400;
  font-size: 34px;
  margin: 0px;

  margin-bottom: 24px;
}

.login__subtitle {
  font-size: 16px;
  margin: 0px;
  margin-bottom: 40px;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.from__email-input {
  margin-bottom: 20px;
}

.from__password-input {
  margin-bottom: 60px;
}

.form__button-set {
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__button {
  width: 220px;
}
</style>
