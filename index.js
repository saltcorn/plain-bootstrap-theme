const {
  ul,
  li,
  a,
  span,
  hr,
  div,
  text,
  i,
  h6,
  h1,
  p,
  header,
  section,
  button,
  nav
} = require("saltcorn-markup/tags");
const { navbar, alert } = require("saltcorn-markup/layout_utils");

const renderCard = (title, body) =>
  div(
    { class: "card shadow mt-4" },
    div(
      { class: "card-header py-3" },
      h6({ class: "m-0 font-weight-bold text-primary" }, text(title))
    ),
    div({ class: "card-body" }, Array.isArray(body) ? body.join("") : body)
  );

const renderHero = (caption, blurb) =>
  section(
    { class: "jumbotron text-center" },
    div(
      { class: "container" },
      h1({ class: "jumbotron-heading" }, caption),
      p({ class: "font-weight-light mb-5" }, blurb)

      /*p (
            a ({ href: "#", class: "btn btn-primary my-2" }, "Main call to action"),
            a ({ href: "#", class: "btn btn-secondary my-2" }, "Secondary action")
          )*/
    )
  );

const renderTitle = ({ title, blurb }) =>
  div(
    h1({ class: "h3 mb-0 mt-2 text-gray-800" }, title),
    blurb && p({ class: "mb-0 text-gray-800" }, blurb)
  );

const renderContainer = ({ type, ...rest }) =>
  type === "card"
    ? renderCard(rest.title, rest.contents)
    : type === "hero"
    ? renderHero(rest.caption, rest.blurb)
    : type === "blank"
    ? rest.contents
    : type === "pageHeader"
    ? renderTitle(rest)
    : "";

const renderBesides = elems => {
  const w = Math.round(12 / elems.length);
  const row = elems.map(e =>
    div(
      { class: `col-sm-${w}` },
      e.above ? renderAbove(e.above) : renderContainer(e)
    )
  );
  return div({ class: "row" }, row);
};

const renderAbove = elems =>
  elems
    .map(e => (e.besides ? renderBesides(e.besides) : renderContainer(e)))
    .join("");

const renderAbovePrimary = (elems, alerts) =>
  elems
    .map((e, ix) =>
      e.type === "hero"
        ? renderContainer(e)
        : e.besides
        ? section(
            {
              class: [
                "page-section",
                ix === 0 && "mt-5",
                e.class,
                e.invertColor && "bg-primary"
              ]
            },
            div({ class: "container" },  ix===0 && alerts.map(a => alert(a.type, a.msg)), renderBesides(e.besides))
          )
        : div(
            { class: ["container", ix === 0 && "mt-5"] },
            div(
              { class: "row" },
              div({ class: "col-sm-12" }, ix===0 && alerts.map(a => alert(a.type, a.msg)), renderContainer(e))
            )
          )
    )
    .join("");

const renderBody = (title, body, alerts) =>
  typeof body === "string"
    ? div(
        { class: "container mt-5" },
        div(
          { class: "row" },
          div({ class: "col-sm-12" }, alerts.map(a => alert(a.type, a.msg)), renderCard(title, body))
        )
      )
    : body.above
    ? renderAbovePrimary(body.above, alerts)
    : renderBesides(body.besides);

const wrap = ({
  title,
  menu,
  brand,
  alerts,
  currentUrl,
  body,
  headers
}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Font Awesome icons (free version)-->
    <script src="https://use.fontawesome.com/releases/v5.13.0/js/all.js" crossorigin="anonymous"></script>
    <link href="https://stackpath.bootstrapcdn.com/bootswatch/4.5.0/litera/bootstrap.min.css" rel="stylesheet" integrity="sha384-Gr51humlTz50RfCwdBYgT+XvbSZqkm8Loa5nWlNrvUqCinoe6C6WUZKHS2WIRx5o" crossorigin="anonymous">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    ${headers
      .filter(h => h.css)
      .map(h => `<link href="${h.css}" rel="stylesheet">`)
      .join("")}
    <title>${text(title)}</title>
  </head>
  <body id="page-top">
    <div id="wrapper">
      ${navbar(brand, menu, currentUrl)}
      ${renderBody(title, body, alerts)}
    </div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" 
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" 
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.bundle.min.js"></script>
    ${headers
      .filter(h => h.script)
      .map(h => `<script src="${h.script}"></script>`)
      .join("")}
  </body>
</html>`;

module.exports = { sc_plugin_api_version: 1, layout: { wrap } };
