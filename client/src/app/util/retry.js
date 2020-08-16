import retry from 'retry';

const defaultOptions = {
  retries: 2,
  factor: 1.35,
  minTimeout: 50,
  randomize: true
};

export async function asyncRetry(func, options) {
  let retryOptions = defaultOptions;
  if (options) {
    retryOptions = options;
  }

  const operation = retry.operation(retryOptions);

  return await new Promise((resolve, reject) => {
    operation.attempt(() => {
      return func()
        .then(resolve)
        .catch((err) => {
          if (operation.retry(err)) {
            return null;
          }

          return reject();
        })
    });
  });
};