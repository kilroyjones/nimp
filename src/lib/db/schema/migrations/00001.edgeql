CREATE MIGRATION m1n4e5urun36iinllvpjy7xewsoc2qghwzdfi6kmj445ur4rqebuoq
    ONTO initial
{
  CREATE TYPE default::Region {
      CREATE REQUIRED PROPERTY x: std::int64;
      CREATE REQUIRED PROPERTY y: std::int64;
  };
};
