import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  title: string;
  questions: IQuizQuestion[];
  userId: mongoose.Types.ObjectId;
  materialId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v: string[]) {
        return v.length >= 2;
      },
      message: 'At least 2 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer is required'],
    min: 0
  },
  explanation: {
    type: String,
    trim: true
  }
}, { _id: false });

const quizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  questions: {
    type: [quizQuestionSchema],
    required: [true, 'Questions are required'],
    validate: {
      validator: function(v: IQuizQuestion[]) {
        return v.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  materialId: {
    type: Schema.Types.ObjectId,
    ref: 'Material',
    default: null
  }
}, {
  timestamps: true
});

quizSchema.index({ userId: 1, createdAt: -1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);