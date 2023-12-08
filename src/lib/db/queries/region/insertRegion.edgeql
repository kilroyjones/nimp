SELECT (INSERT Region {
    x := <int64>$x,
    y := <int64>$y,
    posts := <json>$posts
}) {
    x,
    y,
    posts
};