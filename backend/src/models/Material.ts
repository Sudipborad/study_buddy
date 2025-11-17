import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard {
  front: string;
  back: string;
}

export interface IMaterial extends Document {
  title: string;
  summary: string;
  flashcards: IFlashcard[];
  userId: mongoose.Types.ObjectId;
  sourceDocument?: string;
  createdAt: Date;
  updatedAt: Date;
}

const flashcardSchema = new Schema<IFlashcard>({
  front: {
    type: String,
    required: [true, 'Flashcard front is required'],
    trim: true
  },
  back: {
    type: String,
    required: [true, 'Flashcard back is required'],
    trim: true
  }
}, { _id: false });

const materialSchema = new Schema<IMaterial>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true
  },
  flashcards: {
    type: [flashcardSchema],
    default: []
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sourceDocument: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
materialSchema.index({ userId: 1, createdAt: -1 });

export const Material = mongoose.model<IMaterial>('Material', materialSchema);