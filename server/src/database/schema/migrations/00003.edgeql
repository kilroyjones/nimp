CREATE MIGRATION m1skdudszutcqkiaf2gateo3rbxy3febc2czcs2oydlp64vwjqizea
    ONTO m1zehm7ljwvqttvdfx2oxnxbkapzcxs7rwxdd4bcxz6lyp62outupa
{
  ALTER TYPE default::Region {
      CREATE REQUIRED PROPERTY key: std::str {
          SET REQUIRED USING (<std::str>{});
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
