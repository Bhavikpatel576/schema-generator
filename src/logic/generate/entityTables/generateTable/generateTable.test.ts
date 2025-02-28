import { DataType, DataTypeName, Property } from '../../../../types';
import * as prop from '../../../define/defineProperty';
import { generateColumn } from './generateColumn';
import { generateConstraintForeignKey } from './generateConstraintForeignKey';
import { generateTable } from './generateTable';

jest.mock('./generateColumn');
const generateColumnMock = generateColumn as jest.Mock;
generateColumnMock.mockReturnValue('__COLUMN__');

jest.mock('./generateConstraintForeignKey');
const generateConstraintForeignKeyMock = generateConstraintForeignKey as jest.Mock;
generateConstraintForeignKeyMock.mockReturnValue({ constraint: '__FOREIGN_KEY_CONSTRAINT__', key: '__FOREIGN_KEY_KEY__' });

describe('generateTableConstraint', () => {
  beforeEach(() => jest.clearAllMocks());
  const userIdProperty = new Property({
    type: new DataType({
      name: DataTypeName.INT,
    }),
    references: 'user',
  });
  const statusProperty = prop.ENUM(['happy', 'meh', 'sad']);
  it('should define the table with the correct name', () => {
    const sql = generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(sql).toContain('CREATE TABLE `message`');
  });
  it('should call generateColumn for each property', () => {
    generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(generateColumnMock.mock.calls.length).toEqual(1);
    expect(generateColumnMock.mock.calls[0][0]).toMatchObject({
      property: userIdProperty,
    });
  });
  it('should call generateConstraintForeignKey for each references property', () => {
    generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(generateConstraintForeignKeyMock.mock.calls.length).toEqual(1);
    expect(generateConstraintForeignKeyMock.mock.calls[0][0]).toMatchObject({
      property: userIdProperty,
    });
  });
  it('should define the columns', () => {
    const sql = generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(sql).toContain('__COLUMN__,');
  });
  it('should define id as the primary key', () => {
    const sql = generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(sql).toContain('PRIMARY KEY (`id`),');
  });
  it('should define the unique key', () => {
    const sql = generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(sql).toContain('UNIQUE KEY `message_ux1` (`user_id`),');
  });
  it('should define the foreign key constraints', () => {
    const sql = generateTable({ tableName: 'message', properties: { user_id: userIdProperty }, unique: ['user_id'] });
    expect(sql).toContain('__FOREIGN_KEY_KEY__,');
    expect(sql).toContain('__FOREIGN_KEY_CONSTRAINT__');
  });
  it('should not have empty lines if no foreign keys are defined', () => {
    const sql = generateTable({ tableName: 'message', properties: { status: statusProperty }, unique: ['status'] });
    expect(sql).not.toMatch(/^\s*,?$/m); // no lines should be empty or only contain spaces and a comma
  });
  it('should throw an error if no unique key columns are specified', () => {
    try {
      generateTable({ tableName: 'message', properties: { status: statusProperty }, unique: [] });
      throw new Error('should not reach here');
    } catch (error) {
      expect(error.message).toEqual('must have atleast one unique property; otherwise, idempotency is not guarenteed');
    }
  });
});
