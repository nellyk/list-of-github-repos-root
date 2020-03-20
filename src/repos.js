export default {
    fetch: () => ({
      url: `https://api.github.com/users/americanexpress/repos/:id`,
      opts: {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
          },
    }),
  };