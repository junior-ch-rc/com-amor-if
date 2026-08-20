import { render, screen } from "@testing-library/react";
import NoSchoolClassesNotice from "../NoSchoolClassesNotice";

describe("NoSchoolClassesNotice", () => {
  it("explica por que os lançamentos estão indisponíveis", () => {
    render(<NoSchoolClassesNotice />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "ano letivo aberto ainda não possui turmas"
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "lançamentos ficam indisponíveis"
    );
  });
});
