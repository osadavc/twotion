const Footer = () => {
  return (
    <div className="mt-16 border-t">
      <div className="mx-auto max-w-7xl py-8 text-center">
        <p>
          Made For{" "}
          <a
            href="https://townhall.hashnode.com/planetscale-hackathon"
            target="_blank"
            className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            Hashnode X PlanetScale
          </a>{" "}
          Hackathon By{" "}
          <a
            href="https://github.com/osadavc"
            target="_blank"
            className="bg-gradient-to-br from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            Osada Vidath
          </a>{" "}
          With ❤️{" "}
        </p>
      </div>
    </div>
  );
};

export default Footer;
