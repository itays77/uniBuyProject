import { Request, Response } from 'express';
import Item from '../models/item';

const createItem = async (req: Request, res: Response) => {
  try {
    // Create a new item based on request body
    const newItem = new Item(req.body);

    // Save the item to the database
    await newItem.save();

    // Return the created item
    res.status(201).json(newItem.toObject());
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
};

const getAllItems = async (req: Request, res: Response) => {
  try {
    // Get all items from the database
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ message: 'Error getting items' });
  }
};

const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find item by itemNumber
    const item = await Item.findOne({ itemNumber: id });

    // If item not found, return 404
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Return the item
    res.status(200).json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ message: 'Error getting item' });
  }
};

const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find item by itemNumber and update with new data
    const updatedItem = await Item.findOneAndUpdate(
      { itemNumber: id },
      req.body,
      { new: true } // Return the updated document
    );

    // If item not found, return 404
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Return the updated item
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
};

const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find item by itemNumber and delete
    const deletedItem = await Item.findOneAndDelete({ itemNumber: id });

    // If item not found, return 404
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Return success message
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
};

export default {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
