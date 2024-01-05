CREATE MIGRATION m1ozakpzyjevqyjwsvlj3jz24utiga6dpgwzt4yowcyrkgvkotwhyq
    ONTO m1q5wvtezby3g6qzt5vrjzvzvmzwpm4544ccatb7glsfh5fccwvntq
{
  ALTER TYPE default::Region {
      CREATE PROPERTY odds: std::int16;
      CREATE PROPERTY open: std::bool;
  };
};
