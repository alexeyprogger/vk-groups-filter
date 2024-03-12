export const ErrorPage = () => {
  return (
    <div
      style={{
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "red" }}>Произошла ошибка!</h1>
      <h2 color="red">
        К сожалению, сервер не смог вернуть данные по указанному запросу
      </h2>
      <img width="400px" src="error.png" />
    </div>
  );
};
