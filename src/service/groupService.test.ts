import { GroupService } from './groupService';
import * as GroupModel from '../model/userGroup';
import { Group } from '../model/userGroup';

jest.mock('../model/userGroup');
jest.mock('mysql2/promise', () => {
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

describe('GroupService', () => {
  let groupService: GroupService;
  let mockGroupModel: jest.Mocked<typeof GroupModel>;

  beforeEach(() => {
    groupService = new GroupService();
    mockGroupModel = GroupModel as jest.Mocked<typeof GroupModel>;
    jest.clearAllMocks();
  });

  it('should get all groups', async () => {
    const mockGroups: Group[] = [{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }];
    mockGroupModel.getGroups.mockResolvedValue(mockGroups);

    const groups = await groupService.getGroups();

    expect(groups).toEqual(mockGroups);
    expect(mockGroupModel.getGroups).toHaveBeenCalledTimes(1);
  });

  it('should get a group by id', async () => {
    const mockGroup: Group = { id: 1, name: 'Group 1' };
    mockGroupModel.getGroupById.mockResolvedValue(mockGroup);

    const group = await groupService.getGroupById(1);

    expect(group).toEqual(mockGroup);
    expect(mockGroupModel.getGroupById).toHaveBeenCalledWith(1);
  });

  it('should create a group', async () => {
    const mockGroup: Group = { name: 'New Group' } as Group;
    mockGroupModel.createGroup.mockResolvedValue(3);

    const groupId = await groupService.createGroup(mockGroup);

    expect(groupId).toBe(3);
    expect(mockGroupModel.createGroup).toHaveBeenCalledWith(mockGroup);
  });

  it('should update a group', async () => {
    const mockGroup: Group = { id: 1, name: 'Updated Group' };
    mockGroupModel.updateGroup.mockResolvedValue(undefined);

    await groupService.updateGroup(1, mockGroup);

    expect(mockGroupModel.updateGroup).toHaveBeenCalledWith(1, mockGroup);
  });

  it('should delete a group', async () => {
    mockGroupModel.deleteGroup.mockResolvedValue(undefined);

    await groupService.deleteGroup(1);

    expect(mockGroupModel.deleteGroup).toHaveBeenCalledWith(1);
  });

  it('should add a user to a group', async () => {
    mockGroupModel.addUserToGroup.mockResolvedValue(undefined);

    await groupService.addUserToGroup(1, 2);

    expect(mockGroupModel.addUserToGroup).toHaveBeenCalledWith(1, 2);
  });

  it('should remove a user from a group', async () => {
    mockGroupModel.removeUserFromGroup.mockResolvedValue(undefined);

    await groupService.removeUserFromGroup(1, 2);

    expect(mockGroupModel.removeUserFromGroup).toHaveBeenCalledWith(1, 2);
  });

  it('should get groups by user', async () => {
    const mockGroups: Group[] = [{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }];
    mockGroupModel.getGroupsByUser.mockResolvedValue(mockGroups);

    const groups = await groupService.getGroupsByUser(1);

    expect(groups).toEqual(mockGroups);
    expect(mockGroupModel.getGroupsByUser).toHaveBeenCalledWith(1);
  });
});