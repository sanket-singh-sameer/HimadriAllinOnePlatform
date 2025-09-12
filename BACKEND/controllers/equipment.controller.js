import e from "express";
import Equipment from "../models/equipment.model.js";
import User from "../models/user.model.js";

export const addNewEquipment = async (req, res) => {
  try {
    const { object, quantity } = req.body;
    const addedBy = req.userId;
    if (!object || !quantity || !addedBy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const newEquipment = new Equipment({
      object,
      quantity,
      available: quantity,
      addedBy,
    });

    await newEquipment.save();

    res.status(201).json({
      success: true,
      data: await newEquipment.populate("addedBy", "name email"),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateEquipmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { object, quantity } = req.body;
    const updatedBy = req.userId;

    if (!object || !quantity || !updatedBy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }
    if (
      quantity <
      (await Equipment.findById(id)).issuedHistory.filter(
        (e) => e.status === "issued"
      ).length
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be less than issued quantity",
      });
    }
    const available =
      quantity -
      (await Equipment.findById(id)).issuedHistory.filter(
        (e) => e.status === "issued"
      ).length;
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { object, quantity, available, updatedBy, updatedOn: Date.now() },
      { new: true }
    ).populate("updatedBy", "name email");

    if (!updatedEquipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEquipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const issueEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { roll } = req.body;
    const issuedBy = req.userId;

    if (!roll || !issuedBy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = await User.findOne({ roll: roll.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const issuedTo = student._id;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }
    if (
      equipment.quantity <=
      equipment.issuedHistory.filter((e) => e.status === "issued").length
    ) {
      return res.status(400).json({
        success: false,
        message: "Out of stock",
      });
    }
    equipment.issuedHistory.push({
      issuedTo,
      issuedBy,
      status: "issued",
      issuedOn: Date.now(),
    });

    await equipment.save();

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const returnEquipment = async (req, res) => {
  const { id } = req.params;
  const { roll } = req.body;
  try {
    const student = await User.findOne({ roll: roll.toUpperCase() });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const issuedTo = student._id;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }
    const issuedItem = equipment.issuedHistory.find(
      (e) => e.issuedTo.toString() === issuedTo.toString()
    );
    if (!issuedItem) {
      return res.status(404).json({
        success: false,
        message: "No issued equipment found",
      });
    }

    equipment.issuedHistory.status = "returned";
    equipment.available += 1;
    equipment.issuedHistory.returnedOn = Date.now();
    await equipment.save();

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
