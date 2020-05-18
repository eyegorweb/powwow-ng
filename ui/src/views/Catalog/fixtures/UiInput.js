export default {
  component: () => import('@/components/ui/UiInput.vue'),
  sets: [
    {
      name: 'Set 1',
      props: { placeholder: 'test', inputStyle: { 'font-size': '2rem' } },
    },
  ],
};
