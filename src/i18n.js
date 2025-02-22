import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    email: 'Email',
    password: 'Password',
    login: 'Login',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    noWeightEntry: 'Add weight for this day',
    logout: 'Logout',
  },
  ru: {
    email: 'Почта',
    password: 'Пароль',
    login: 'Войти',
    signUp: 'Зарегистрироваться',
    signIn: 'Войти',
    noWeightEntry: 'Добавить вес для этого дня',
    logout: 'Выйти',
  },
};

const i18n = createI18n({
  legacy: true, // Use Composition API
  locale: 'en', // Default language
  fallbackLocale: 'en',
  messages,
});

export default i18n;
