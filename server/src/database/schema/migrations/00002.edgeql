CREATE MIGRATION m1zehm7ljwvqttvdfx2oxnxbkapzcxs7rwxdd4bcxz6lyp62outupa
    ONTO m13af4rlataohuu33tjk4dvk5buuqjce3nt5na7bwtl4da25isspnq
{
  ALTER TYPE default::Region {
      ALTER PROPERTY prob {
          RENAME TO odds;
      };
  };
};
