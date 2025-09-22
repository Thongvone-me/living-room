
const buildResponse = ({ success, message, data = null, meta = null }) => {
    const response = { success, message };
    if (data !== null) response.data = data;
    if (meta !== null) response.meta = meta;
    return response;
};

export const SendSuccess = (res, message, data = null, meta = null) => {
    res.status(200).json(buildResponse({ success: true, message, data, meta }));
};

export const SendCreate = (res, message, data = null, meta = null) => {
    res.status(201).json(buildResponse({ success: true, message, data, meta }));
};

export const SendError = (res, status, message, data = null, meta = null) => {
    res.status(status).json(buildResponse({ success: false, message, data, meta }));
};