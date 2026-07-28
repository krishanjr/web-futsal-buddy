import { FutsalMongoRepository } from "../repositories/futsal.repository";
import {
    CreateFutsalDTO,
    UpdateFutsalDTO,
    SearchFutsalDTO,
    SetHolidaysDTO,
    AddFutsalImagesDTO,
} from "../dtos/futsal.dto";
import { IFutsal } from "../models/futsal.model";
import { HttpException } from "../exceptions/http-exception";

const futsalRepository = new FutsalMongoRepository();

export class FutsalService {
    // ─── Organizer ──────────────────────────────────────────────────────────

    async createFutsal(organizerId: string, data: CreateFutsalDTO): Promise<IFutsal> {
        const futsal = await futsalRepository.create({
            ...data,
            organizerId,
            isVerified: false,
        });
        return futsal;
    }

    async getMyFutsals(organizerId: string): Promise<IFutsal[]> {
        return await futsalRepository.findByOrganizer(organizerId);
    }

    async updateFutsal(
        organizerId: string,
        futsalId: string,
        data: UpdateFutsalDTO
    ): Promise<IFutsal> {
        const futsal = await this.assertOwnership(organizerId, futsalId);
        const updated = await futsalRepository.update(futsal._id.toString(), data as Partial<IFutsal>);
        if (!updated) throw new HttpException(500, "Failed to update futsal");
        return updated;
    }

    async deleteFutsal(organizerId: string, futsalId: string): Promise<void> {
        const futsal = await this.assertOwnership(organizerId, futsalId);
        await futsalRepository.delete(futsal._id.toString());
    }

    async addImages(
        organizerId: string,
        futsalId: string,
        data: AddFutsalImagesDTO
    ): Promise<IFutsal> {
        const futsal = await this.assertOwnership(organizerId, futsalId);
        const updated = await futsalRepository.update(futsal._id.toString(), {
            images: [...futsal.images, ...data.images],
        });
        if (!updated) throw new HttpException(500, "Failed to add images");
        return updated;
    }

    async removeImage(organizerId: string, futsalId: string, imageUrl: string): Promise<IFutsal> {
        const futsal = await this.assertOwnership(organizerId, futsalId);
        const updated = await futsalRepository.update(futsal._id.toString(), {
            images: futsal.images.filter((img) => img !== imageUrl),
        });
        if (!updated) throw new HttpException(500, "Failed to remove image");
        return updated;
    }

    async setHolidays(
        organizerId: string,
        futsalId: string,
        data: SetHolidaysDTO
    ): Promise<IFutsal> {
        const futsal = await this.assertOwnership(organizerId, futsalId);
        const updated = await futsalRepository.update(futsal._id.toString(), {
            holidays: data.holidays,
        });
        if (!updated) throw new HttpException(500, "Failed to set holidays");
        return updated;
    }

    private async assertOwnership(organizerId: string, futsalId: string): Promise<IFutsal> {
        const futsal = await futsalRepository.findById(futsalId);
        if (!futsal) throw new HttpException(404, "Futsal not found");
        if (futsal.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to manage this futsal");
        }
        return futsal;
    }

    // ─── Public / Player ────────────────────────────────────────────────────

    async getFutsalById(id: string): Promise<IFutsal> {
        const futsal = await futsalRepository.findById(id);
        if (!futsal) throw new HttpException(404, "Futsal not found");
        return futsal;
    }

    async searchFutsals(query: SearchFutsalDTO) {
        const filters: Record<string, any> = { isActive: true, isVerified: true };
        if (query.district) filters.district = { $regex: query.district, $options: "i" };
        if (query.search) filters.name = { $regex: query.search, $options: "i" };
        if (query.facilities?.length) filters.facilities = { $all: query.facilities };
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filters.pricePerHour = {};
            if (query.minPrice !== undefined) filters.pricePerHour.$gte = query.minPrice;
            if (query.maxPrice !== undefined) filters.pricePerHour.$lte = query.maxPrice;
        }

        const skip = (query.page - 1) * query.limit;
        const [futsals, total] = await Promise.all([
            futsalRepository.search(filters, skip, query.limit),
            futsalRepository.countSearch(filters),
        ]);

        return {
            futsals,
            meta: { page: query.page, limit: query.limit, total },
        };
    }
}
