import Collection from "./index";
import { BufferedBus, NoopBus } from "mesh";
import expect from "expect.js";

describe(__filename + "#", function() {

  it("can be created", function() {
    new Collection();
  });

  it("can be created with a source array", function() {
    var c = new Collection({
      source: [9, 8, 7, 6]
    });
    expect(c.length).to.be(4);
    expect(c.at(0)).to.be(9);
    expect(c.at(3)).to.be(6);
  });

  it("can push items onto the collection", function() {
    var c = new Collection();
    c.push(5, 6, 7, 8);
    expect(c.length).to.be(4);
    expect(c.at(0)).to.be(5);
    expect(c.at(1)).to.be(6);
  });

  it("can shift items onto the collection", function() {
    var c = new Collection();
    c.shift(5, 4, 5);
    expect(c.length).to.be(3);
    c.shift(5, 4, 2);
    expect(c.length).to.be(6);
    expect(c.at(0)).to.be(5);
    expect(c.at(2)).to.be(2);
    expect(c.at(5)).to.be(5);
  });

  it("can pop & unshift items from the collection", function() {
    var c = new Collection({ source: [1, 2, 3, 4] });
    expect(c.length).to.be(4);
    c.pop();
    expect(c.length).to.be(3);
    c.unshift();
    expect(c.length).to.be(2);
    expect(c.at(0)).to.be(2);
    expect(c.at(1)).to.be(3);
  });

  it("can call 'map'", function() {
    var items = (new Collection({ source: [5, 4, 3, 2] })).map(function(n) {
      return n - 1;
    });
    expect(items.join("")).to.be("4321");
  });

  xit("tails 'inserts' executed on a bus", async function() {
    var bus = new NoopBus();
    var c = new Collection({ })
  });
});
