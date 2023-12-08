SELECT Region {
    x,
    y,
    posts
}
FILTER .x = <int64>$x AND .y = <int64>$y
LIMIT 1;