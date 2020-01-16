<template> </template>

<script>
export default {
  async asyncData({ params, error }) {
    try {
      console.log(params);
      //   const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${+params.id}`)
      //   return data
    } catch (e) {
      error({ message: 'User not found', statusCode: 404 });
    }
  },
};
</script>