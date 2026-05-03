<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";

import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "plain",
});
const schema = z.object({
  email: z.string("Required field").email("Incorrect email"),
});

const resolver = zodResolver(schema);
const router = useRouter();
const authStore = useAuthStore();
const { successToast, errorToast } = useAppToast();

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) return;

  try {
    const { email } = event.values;

    await authStore.forgotPassword(email);
    successToast("Check your email inbox");
    await router.push("/auth/login");
  } catch (error) {
    if (error instanceof Error) {
      errorToast(error.message);
      console.log(error);
    }
  }
};
</script>

<template>
  <div class="forgot-password">
    <h1 class="forgot-password__title">Forgot password</h1>
    <p class="forgot-password__subtitle">
      We will send you an email with further instructions
    </p>
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
            <InputText :id="inputId" fluid name="email" autocomplete="email" />
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

      <div class="form__button-set">
        <AppButton
          label="RESET PASSWORD"
          class="form__button"
          button-type="submit"
        />
        <AppButton
          label="CANCEL"
          variant="text"
          severity="secondary"
          class="form__button"
          @click="() => router.back()"
        />
      </div>
    </Form>
  </div>
</template>
<style scoped>
.forgot-password {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 560px;
  height: 100%;
}

.forgot-password__title {
  font-weight: 400;
  font-size: 34px;
  margin: 0px;

  margin-bottom: 24px;
}

.forgot-password__subtitle {
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
