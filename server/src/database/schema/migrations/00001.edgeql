CREATE MIGRATION m13af4rlataohuu33tjk4dvk5buuqjce3nt5na7bwtl4da25isspnq
    ONTO initial
{
  CREATE TYPE default::Region {
      CREATE PROPERTY digs: array<std::int16>;
      CREATE PROPERTY open: std::bool;
      CREATE PROPERTY posts: std::json;
      CREATE PROPERTY prob: std::int16;
      CREATE REQUIRED PROPERTY x: std::int64;
      CREATE REQUIRED PROPERTY y: std::int64;
  };
};
