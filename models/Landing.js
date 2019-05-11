/* jshint indent: 2 */

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Landing  = sequelize.define('Landing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },   
    title_tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paragraph1: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    paragraph2: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    paragraph3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    button_cta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    redirect_url: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return Landing;
};