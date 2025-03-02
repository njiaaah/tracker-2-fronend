import { createI18n } from 'vue-i18n';
import Weight from './components/Tiles/Weight.vue';

const messages = {
  en: {
    email: 'Email',
    password: 'Password',
    login: 'Login',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    noWeightEntry: 'Add weight for this day',
    logout: 'Logout',
    addWeight: 'Add weight',
    addFood: 'Add food',
    settings: 'Settings',
    weight: 'Weight',
    foods: 'Food',
    food: 'Food',
    goal: 'Goal'
  },
  ru: {
    email: 'Почта',
    password: 'Пароль',
    login: 'Войти',
    signUp: 'Зарегистрироваться',
    signIn: 'Войти',
    noWeightEntry: 'Добавить вес для этого дня',
    logout: 'Выйти',
    addWeight: 'Добавить вес',
    addFood: 'Добавить продукт',
    settings: 'Настройки',
    weight: 'Вес',
    foods: 'Продукты',
    food: 'Продукт',
    goal: 'Цель',
  },
};

const i18n = createI18n({
  legacy: true, // Use Composition API
  locale: 'en', // Default language
  fallbackLocale: 'en',
  messages,
});

export default i18n;
