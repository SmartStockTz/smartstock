addEventListener('message', ({data}) => {
  const response = `worker response to ${data}`;
  // @ts-ignore
  postMessage(response);
});
