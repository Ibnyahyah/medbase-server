import Record from "../model/record.js";

export const CreateRecord = async (req, res) => {
  const newRecord = new Record(req.body);
  try {
    const data = await newRecord.save();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

export const getRecords = async (req, res) => {
  try {
    const records = await Record.find();

    res.status(200).json(records);
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any records");
    console.log(error);
  }
};
export const getRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    res.status(200).json(record);
  } catch (error) {
    res.status(404).json({ message: error }, "Can't any records");
    console.log(error);
  }
};