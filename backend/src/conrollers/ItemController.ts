import { Request, Response } from 'express';
import Item from '../models/item';

// Create a new item
const createItem = async (req: Request, res: Response) => {
  try {
    
    const newItem = new Item(req.body);

    
    await newItem.save();

    
    res.status(201).json(newItem.toObject());
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
};

// Get all items
const getAllItems = async (req: Request, res: Response) => {
  try {
    
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ message: 'Error getting items' });
  }
};

// Get an item by ID
const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const item = await Item.findOne({ itemNumber: id });

    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ message: 'Error getting item' });
  }
};


// Update an item
const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const updatedItem = await Item.findOneAndUpdate(
      { itemNumber: id },
      req.body,
      { new: true } 
    );

    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item' });
  }
};

// Delete an item
const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const deletedItem = await Item.findOneAndDelete({ itemNumber: id });

    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    
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
