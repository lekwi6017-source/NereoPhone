function randomCP(): { title: string; content: string } {
  const pair = ['A×B', 'Alpha×Omega', '学长×学弟', '骑士×法师'][Math.floor(Math.random() * 4)];
  return {
    title: `【长帖】关于 ${pair} 的一些设定脑洞`,
    content:
      '1）相遇在雨夜公交站；2）他们共用一把伞；3）B 会假装不在意但每次都提前到场；4）如果你也磕这个对，你会怎么写第一场吵架？（只读·示例）'
  };
}

export default function Forum() {
  const post = randomCP();
  return (
    <div className="p-3">
      <article className="bg-white rounded-xl p-3 shadow-sm">
        <h2 className="font-semibold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
      </article>
    </div>
  );
}
