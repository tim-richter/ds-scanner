// According to JSON-RPC 2.0 and tRPC documentation.
// https://trpc.io/docs/rpc
export const jsonRpcSuccessResponse = (data: unknown) => ({
  id: null,
  result: { type: 'data', data },
});
