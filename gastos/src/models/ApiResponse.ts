export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T; // Replace `any` with the actual structure if known
}