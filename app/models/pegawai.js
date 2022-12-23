'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pegawai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pegawai.init({
    // id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    nip: DataTypes.STRING,
    email: DataTypes.STRING,
    no_hp: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    unit_kerja: DataTypes.STRING
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'Pegawai',
    tableName: 't_pegawai'
    // tableName: 't_pegawai' CONTOH BUAT CUSTOM TABLE NO SINGULAR
  });
  return Pegawai;
};