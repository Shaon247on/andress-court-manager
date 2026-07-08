export function handleApiError(err: any) {
  if (!err) return { message: 'Unknown error' };
  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;
    if (status === 401) return { message: 'Unauthorized', status };
    if (data && data.message) return { message: data.message, status };
    return { message: 'Server error', status };
  }
  if (err.request) return { message: 'No response from server' };
  return { message: err.message || String(err) };
}

export function handleActionResponse(data: any) {
  if (!data) return { success: false, message: 'No data returned' };
  if (data.success === false) return { success: false, message: data.message || 'Request failed' };
  return { success: true, data };
}
