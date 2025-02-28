import { DataType, DataTypeName, Property } from '../../../../types';
import { generateConstraintForeignKey } from './generateConstraintForeignKey';

describe('generateTableConstraint', () => {
  const property = new Property({
    type: new DataType({
      name: DataTypeName.INT,
    }),
    references: 'user',
  });
  describe('constraintSql', () => {
    it('should define the constraint name accurately', () => {
      const { constraint: sql } = generateConstraintForeignKey({ index: 2, tableName: 'message', columnName: 'user_id', property });
      expect(sql).toContain('`message_fk2`');
    });
    it('should define column name accurately', () => {
      const { constraint: sql } = generateConstraintForeignKey({ index: 2, tableName: 'message', columnName: 'user_id', property });
      expect(sql).toContain('(`user_id`)');
    });
    it('should define referenced table accurately', () => {
      const { constraint: sql } = generateConstraintForeignKey({ index: 2, tableName: 'message', columnName: 'user_id', property });
      expect(sql).toContain('REFERENCES `user`');
    });
  });
  describe('keySql', () => {
    it('should define the constraint name accurately', () => {
      const { key: sql } = generateConstraintForeignKey({ index: 2, tableName: 'message', columnName: 'user_id', property });
      expect(sql).toContain('`message_fk2`');
    });
    it('should define column name accurately', () => {
      const { key: sql } = generateConstraintForeignKey({ index: 2, tableName: 'message', columnName: 'user_id', property });
      expect(sql).toContain('(`user_id`)');
    });
  });
});
