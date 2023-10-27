import { HttpStatus } from '@nestjs/common'

export const useResponse = () => {
    function createResponse(data: any, statusCode: HttpStatus = HttpStatus.OK) {
        return { data, statusCode }
    }
    return {
        createResponse
    }
}