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
  pre,
  footer,
  section,
  header,
  button,
  nav,
  style
} = require("@saltcorn/markup/tags");
const {
  navbar,
  alert,
  navbarSolidOnScroll
} = require("@saltcorn/markup/layout_utils");
const renderLayout = require("@saltcorn/markup/layout");


const blockDispatch = {
  pageHeader: ({ title, blurb }) =>
    div(
      h1({ class: "h3 mb-0 mt-2 text-gray-800" }, title),
      blurb && p({ class: "mb-0 text-gray-800" }, blurb)
    ),
  card: ({ title, contents }) =>
    div(
      { class: "card shadow mt-4" },
      title &&
        div(
          { class: "card-header py-3" },
          h6({ class: "m-0 font-weight-bold text-primary" }, text(title))
        ),
      div(
        { class: "card-body" },
        Array.isArray(contents) ? contents.join("") : contents
      )
    ),
  footer: ({ contents }) =>
    div(
      { class: "container" },
      footer(
        { id: "footer" },
        div({ class: "row" }, div({ class: "col-sm-12" }, contents))
      )
    ),
  hero: ({ caption, blurb, cta, backgroundImage }) =>
    section(
      {
        class:
          "jumbotron text-center m-0 bg-info d-flex flex-column justify-content-center"
      },
      div(
        { class: "container" },
        h1({ class: "jumbotron-heading" }, caption),
        p({ class: "lead" }, blurb),
        cta
      ),
      backgroundImage &&
        style(`.jumbotron {
      background-image: url("${backgroundImage}");
      background-size: cover;
      min-height: 75vh !important;
    }`)
    ),
  wrapTop: (segment, ix, s) =>
    ["hero", "footer"].includes(segment.type)
      ? s
      : section(
          {
            class: [
              "page-section",
              ix === 0 && "mt-5",
              segment.class,
              segment.invertColor && "bg-primary"
            ]
          },
          div(
            { class: ["container"] },
            div({ class: "row" }, div({ class: "col-sm-12" }, s))
          )
        )
};

const makeSegments = (title, body, alerts) => {
  const alertsSegments = alerts && alerts.length>0
    ? [{ type: "blank", contents: alerts.map(a => alert(a.type, a.msg)) }]
    : [];
  if (typeof body === "string")
    return {
      above: [...alertsSegments, { type: "card", title, contents: body }]
    };
  else if (body.above) {
    if (alerts&& alerts.length>0) body.above.unshift(alertsSegments[0]);
    return body;
  } else {
    if (alerts&& alerts.length>0) return { above: [...alertsSegments, body] };
    else return body;
  }
};

const renderBody = (title, body, alerts) =>
  renderLayout(blockDispatch)(makeSegments(title, body, alerts));

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
    <script defer src="https://use.fontawesome.com/releases/v5.13.0/js/all.js" crossorigin="anonymous"></script>
    <link href="https://stackpath.bootstrapcdn.com/bootswatch/4.5.0/united/bootstrap.min.css" rel="stylesheet" integrity="sha384-Uga2yStKRHUWCS7ORqIZhJ9LIAv4i7gZuEdoR1QAmw6H+ffhcf7yCOd0CvSoNwoz" crossorigin="anonymous">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    ${headers
      .filter(h => h.css)
      .map(h => `<link href="${h.css}" rel="stylesheet">`)
      .join("")}
    ${headers
      .filter(h => h.headerTag)
      .map(h => h.headerTag)
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
    ${navbarSolidOnScroll}
  </body>
</html>`;

module.exports = { sc_plugin_api_version: 1, layout: { wrap } };
