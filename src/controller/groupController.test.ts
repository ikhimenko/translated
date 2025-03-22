import { GroupController } from "./groupController";
import { GroupService } from "../service/groupService";
import { Request, Response } from "express";
import { Group } from "../model/userGroup";

jest.mock("../service/groupService");
jest.mock("mysql2/promise", () => {
  const mockPool = {
    getConnection: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue([[], []]),
      release: jest.fn(),
    }),
    end: jest.fn(),
  };
  return {
    createPool: jest.fn().mockReturnValue(mockPool),
  };
});

describe("GroupController", () => {
  let groupController: GroupController;
  let mockGroupService: jest.Mocked<GroupService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockGroupService = new GroupService() as jest.Mocked<GroupService>;
    groupController = new GroupController(mockGroupService);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should get all groups", async () => {
    const mockGroups: Group[] = [
      { id: 1, name: "Group 1" },
      { id: 2, name: "Group 2" },
    ];
    mockGroupService.getGroups.mockResolvedValue(mockGroups);

    await groupController.getGroups(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockGroups);
    expect(mockGroupService.getGroups).toHaveBeenCalledTimes(1);
  });

  it("should get a group by id", async () => {
    const mockGroup: Group = { id: 1, name: "Group 1" };
    mockGroupService.getGroupById.mockResolvedValue(mockGroup);
    mockRequest.params = { id: "1" };

    await groupController.getGroupById(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockGroup);
    expect(mockGroupService.getGroupById).toHaveBeenCalledWith(1);
  });

  it("should return 404 if group not found", async () => {
    mockGroupService.getGroupById.mockResolvedValue(null);
    mockRequest.params = { id: "1" };

    await groupController.getGroupById(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Group not found",
    });
  });

  it("should create a group", async () => {
    const mockGroup: Group = { name: "New Group" };
    mockGroupService.createGroup.mockResolvedValue(3);
    mockRequest.body = mockGroup;

    await groupController.createGroup(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 3,
      message: "Group created successfully",
    });
    expect(mockGroupService.createGroup).toHaveBeenCalledWith(mockGroup);
  });

  it("should update a group", async () => {
    const mockGroup: Group = { id: 1, name: "Updated Group" };
    mockGroupService.updateGroup.mockResolvedValue(undefined);
    mockRequest.params = { id: "1" };
    mockRequest.body = mockGroup;

    await groupController.updateGroup(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockGroupService.updateGroup).toHaveBeenCalledWith(1, mockGroup);
  });

  it("should delete a group", async () => {
    mockGroupService.deleteGroup.mockResolvedValue(undefined);
    mockRequest.params = { id: "1" };

    await groupController.deleteGroup(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockGroupService.deleteGroup).toHaveBeenCalledWith(1);
  });

  it("should add a user to a group", async () => {
    mockGroupService.addUserToGroup.mockResolvedValue(undefined);
    mockRequest.params = { id: "2" };
    mockRequest.body = { userId: 1 };

    await groupController.addUserToGroup(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockGroupService.addUserToGroup).toHaveBeenCalledWith(1, 2);
  });

  it("should remove a user from a group", async () => {
    mockGroupService.removeUserFromGroup.mockResolvedValue(undefined);
    mockRequest.params = { id: "2" };
    mockRequest.body = { userId: 1 };

    await groupController.removeUserFromGroup(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockGroupService.removeUserFromGroup).toHaveBeenCalledWith(1, 2);
  });

  it("should get groups by user", async () => {
    const mockGroups: Group[] = [
      { id: 1, name: "Group 1" },
      { id: 2, name: "Group 2" },
    ];
    mockGroupService.getGroupsByUser.mockResolvedValue(mockGroups);
    mockRequest.params = { id: "1" };

    await groupController.listGroupsByUser(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockGroups);
    expect(mockGroupService.getGroupsByUser).toHaveBeenCalledWith(1);
  });
});
