/**
 * Extracts a user-friendly error message from an error object
 * @param {Object} error - The error object from API calls or other operations
 * @param {string} defaultMessage - Default message to show if no specific message is found
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (
  error,
  defaultMessage = "Ha ocurrido un error inesperado"
) => {
  // If error is a string, return it directly
  if (typeof error === "string") {
    return error;
  }

  // If error is not an object, return default message
  if (!error || typeof error !== "object") {
    return defaultMessage;
  }

  // Try to extract message from various possible error structures

  // Check for response.data.message (common in axios errors)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for response.data.error
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Check for response.data.errors (array of errors)
  if (
    error.response?.data?.errors &&
    Array.isArray(error.response.data.errors)
  ) {
    if (error.response.data.errors.length > 0) {
      // If it's an array of strings
      if (typeof error.response.data.errors[0] === "string") {
        return error.response.data.errors[0];
      }
      // If it's an array of objects with message property
      if (error.response.data.errors[0].message) {
        return error.response.data.errors[0].message;
      }
    }
  }

  // Check for direct message property
  if (error.message) {
    return error.message;
  }

  // Check for response.statusText
  if (error.response?.statusText) {
    return error.response.statusText;
  }

  // Handle specific HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return "Solicitud incorrecta. Verifique los datos enviados.";
      case 401:
        return "No autorizado. Por favor, inicie sesión nuevamente.";
      case 403:
        return "No tiene permisos para realizar esta acción.";
      case 404:
        return "El recurso solicitado no fue encontrado.";
      case 422:
        return "Los datos enviados no son válidos.";
      case 500:
        return "Error interno del servidor. Intente nuevamente más tarde.";
      case 503:
        return "Servicio no disponible. Intente nuevamente más tarde.";
      default:
        return `Error ${error.response.status}: ${defaultMessage}`;
    }
  }

  // If nothing else matches, return the default message
  return defaultMessage;
};

export default getErrorMessage;
