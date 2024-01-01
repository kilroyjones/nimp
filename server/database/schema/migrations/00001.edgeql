CREATE MIGRATION m1q5wvtezby3g6qzt5vrjzvzvmzwpm4544ccatb7glsfh5fccwvntq
    ONTO initial
{
  CREATE TYPE default::Region {
      CREATE PROPERTY posts: std::json;
      CREATE REQUIRED PROPERTY x: std::int64;
      CREATE REQUIRED PROPERTY y: std::int64;
  };
};
