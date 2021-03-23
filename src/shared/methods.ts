export const sendResult = (result: any) => ({ ok: true, result });
export const sendError = (error: any) => ({ ok: false, error });
