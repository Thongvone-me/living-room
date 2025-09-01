
export const SendSuccess = (res, message, data) => {
    res.status(200).json({ success: true, message, data });
};

export const SendCreate = (res, message, data) => {
    res.status(201).json({ success: true, message, data });
};

export const SendError = (res, message, data) => {
    res.status(400).json({ success: false, message, data });
};