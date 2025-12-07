import { Document, FilterQuery, Model } from "mongoose";

interface SearchOptions {
    offset?: number;
    limit?: number;
}

export class BaseRepository<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async find(where: FilterQuery<T>, options: SearchOptions = {}): Promise<T[]> {
        const countDocuments = await this.model.countDocuments(where)
        const result = await this.model.find(where).limit(options.limit || countDocuments).skip(options.offset || 0).sort({
            createdAt: 'asc',
        });
        return result as T[]
    }

    async findOne(where: FilterQuery<T>) {
        return await this.model.findOne(where);
    }

    async create(data: Partial<T>) {
        const newDocument = new this.model(data);
        await newDocument.save();
        return newDocument;
    }

    async update(where: FilterQuery<T>, data: Partial<T>) {
        return await this.model.findOneAndUpdate(where, data);
    }

    async updateMany(where: FilterQuery<T>, data: Partial<T>) {
        return await this.model.updateMany(where, data);
    }

    async delete(where: FilterQuery<T>) {
        return await this.model.findOneAndDelete(where);
    }

    async deleteMany(where: FilterQuery<T>) {
        return await this.model.deleteMany(where);
    }
}