<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { useAuthStore } from "~/stores/auth";

import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";

const schema = z.object({
  email: z.string("Required field").email("Incorrect email"),
  password: z.string("Required field").min(6, "Minimum 6 symbols"),
});

const resolver = zodResolver(schema);
const router = useRouter();
const authStore = useAuthStore();
const { successToast, errorToast } = useAppToast();

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) return;

  try {
    const { email, password } = event.values;

    await authStore.Login(email, password);
    successToast("Successfully loged in!");
    await router.push("/users");
  } catch (error) {
    if (error instanceof Error) {
      errorToast(error.message);
      console.log(error);
    }
  }
};
</script>
<template>
  <div class="login">
    <h1 class="login__title">Welcome back</h1>
    <p class="login__subtitle">Hello again! Log in to continue</p>
    <Form
      v-slot="$form"
      class="form"
      :resolver
      :validate-on-value-update="false"
      :validate-on-blur="true"
      validate-on-submit
      autocomplete="on"
      @submit="onSubmit"
    >
      <div class="form__email-input">
        <AppFloatLabel label="Email" input-id="email">
          <template #default="{ inputId }">
            <InputText
              :id="inputId"
              fluid
              name="email"
              autocomplete="username"
            />
          </template>
        </AppFloatLabel>
        <Message
          v-if="$form.email?.invalid"
          severity="error"
          variant="simple"
          class="input-message"
          >{{ $form.email.error.message }}</Message
        >
      </div>
      <div class="form__password-input">
        <AppFloatLabel label="Password" input-id="password">
          <template #default="{ inputId }">
            <Password
              :id="inputId"
              toggle-mask
              name="password"
              :feedback="false"
              fluid
              autocomplete="current-password"
            />
          </template>
        </AppFloatLabel>
        <Message
          v-if="$form.password?.invalid"
          severity="error"
          variant="simple"
          class="input-message"
          >{{ $form.password.error.message }}</Message
        >
      </div>
      <div class="form__button-set">
        <AppButton label="LOG IN" class="form__button" button-type="submit" />
        <AppButton
          label="FORGOT PASSWORD"
          variant="text"
          severity="secondary"
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

.form__email-input {
  margin-bottom: 20px;
}

.form__password-input {
  margin-bottom: 60px;
}

.input-message {
  margin-top: 3px;
  margin-left: 10px;
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
