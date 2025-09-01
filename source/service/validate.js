

// Finds which fields are empty in your data on database.
//(validate = ກວດສອບຄວາມຖືກຕ້ອງ )
export const validateData = async (data) => {
    return Object.keys(data).filter((key) => !data[key]);
};