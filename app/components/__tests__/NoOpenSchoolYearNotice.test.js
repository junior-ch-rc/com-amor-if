import { render, screen } from "@testing-library/react";
import NoOpenSchoolYearNotice from "../NoOpenSchoolYearNotice";

describe("NoOpenSchoolYearNotice", () => {
  it("explica por que as alterações de pontuação estão indisponíveis", () => {
    render(<NoOpenSchoolYearNotice />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não há ano letivo aberto"
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "alterações de pontuação ficam indisponíveis"
    );
  });
});
