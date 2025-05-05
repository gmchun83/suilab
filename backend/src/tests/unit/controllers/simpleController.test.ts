import { Request, Response } from 'express';

// Mock controller function
const mockController = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
};

describe('Simple Controller Test', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
  });

  it('should return success message', () => {
    mockController(mockRequest as Request, mockResponse as Response);
    
    expect(responseStatus).toHaveBeenCalledWith(200);
    expect(responseJson).toHaveBeenCalledWith({ message: 'Success' });
  });
});
