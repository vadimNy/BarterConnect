import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Curated list of major US cities
const CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
  "Mesa, AZ", "Kansas City, MO", "Atlanta, GA", "Long Beach, CA", "Omaha, NE",
  "Raleigh, NC", "Colorado Springs, CO", "Miami, FL", "Virginia Beach, VA", "Oakland, CA",
  "Minneapolis, MN", "Tulsa, OK", "Arlington, TX", "New Orleans, LA", "Wichita, KS",
  "Cleveland, OH", "Tampa, FL", "Bakersfield, CA", "Aurora, CO", "Anaheim, CA",
  "Honolulu, HI", "Santa Ana, CA", "Riverside, CA", "Corpus Christi, TX", "Lexington, KY",
  "Stockton, CA", "Henderson, NV", "Saint Paul, MN", "St. Louis, MO", "Cincinnati, OH",
  "Pittsburgh, PA", "Greensboro, NC", "Anchorage, AK", "Plano, TX", "Lincoln, NE",
  "Orlando, FL", "Irvine, CA", "Newark, NJ", "Toledo, OH", "Durham, NC",
  "Chula Vista, CA", "Fort Wayne, IN", "Jersey City, NJ", "St. Petersburg, FL", "Laredo, TX",
  "Madison, WI", "Chandler, AZ", "Buffalo, NY", "Lubbock, TX", "Scottsdale, AZ",
  "Reno, NV", "Glendale, AZ", "Gilbert, AZ", "Winston-Salem, NC", "North Las Vegas, NV",
  "Norfolk, VA", "Chesapeake, VA", "Garland, TX", "Irving, TX", "Hialeah, FL",
  "Fremont, CA", "Boise, ID", "Richmond, VA", "Baton Rouge, LA", "Spokane, WA",
  "Des Moines, IA", "Tacoma, WA", "San Bernardino, CA", "Modesto, CA", "Fontana, CA",
  "Santa Clarita, CA", "Birmingham, AL", "Oxnard, CA", "Fayetteville, NC", "Rochester, NY",
  "Moreno Valley, CA", "Glendale, CA", "Yonkers, NY", "Huntington Beach, CA", "Aurora, IL",
  "Salt Lake City, UT", "Amarillo, TX", "Montgomery, AL", "Grand Rapids, MI", "Little Rock, AR",
  "Akron, OH", "Augusta, GA", "Huntsville, AL", "Columbus, GA", "Grand Prairie, TX",
  "Shreveport, LA", "Overland Park, KS", "Tallahassee, FL", "Mobile, AL", "Port St. Lucie, FL",
  "Knoxville, TN", "Worcester, MA", "Tempe, AZ", "Cape Coral, FL", "Brownsville, TX",
  "McKinney, TX", "Providence, RI", "Fort Lauderdale, FL", "Newport News, VA", "Rancho Cucamonga, CA",
  "Santa Rosa, CA", "Peoria, AZ", "Oceanside, CA", "Elk Grove, CA", "Sioux Falls, SD",
  "Salem, OR", "Pembroke Pines, FL", "Eugene, OR", "Garden Grove, CA", "Cary, NC",
  "Fort Collins, CO", "Corona, CA", "Springfield, MO", "Jackson, MS", "Alexandria, VA",
  "Hayward, CA", "Lancaster, CA", "Lakewood, CO", "Clarksville, TN", "Palmdale, CA",
  "Salinas, CA", "Springfield, MA", "Hollywood, FL", "Pasadena, TX", "Sunnyvale, CA",
  "Macon, GA", "Kansas City, KS", "Pomona, CA", "Escondido, CA", "Killeen, TX",
  "Naperville, IL", "Joliet, IL", "Bellevue, WA", "Rockford, IL", "Savannah, GA",
  "Paterson, NJ", "Torrance, CA", "Bridgeport, CT", "McAllen, TX", "Mesquite, TX",
  "Syracuse, NY", "Midland, TX", "Pasadena, CA", "Murrieta, CA", "Miramar, FL",
  "Dayton, OH", "Fullerton, CA", "Olathe, KS", "Orange, CA", "Thornton, CO",
  "Roseville, CA", "Denton, TX", "Waco, TX", "Surprise, AZ", "Carrollton, TX",
  "West Valley City, UT", "Charleston, SC", "Warren, MI", "Gainesville, FL", "San Buenaventura (Ventura), CA",
  "Coral Springs, FL", "Visalia, CA", "Cedar Rapids, IA", "Columbia, SC", "Santa Clara, CA",
  "New Haven, CT", "Stamford, CT", "Elizabeth, NJ", "Concord, CA", "Thousand Oaks, CA",
  "Kent, WA", "Simi Valley, CA", "Lafayette, LA", "Hartford, CT", "Athens, GA",
  "Victorville, CA", "Abilene, TX", "Norman, OK", "Vallejo, CA", "Berkeley, CA",
  "Allentown, PA", "Beaumont, TX", "Independence, MO", "Columbia, MO", "Springfield, IL",
  "El Monte, CA", "Ann Arbor, MI", "Provo, UT", "Peoria, IL", "Lansing, MI",
  "Fargo, ND", "Downey, CA", "Costa Mesa, CA", "Wilmington, NC", "Arvada, CO",
  "Inglewood, CA", "Miami Gardens, FL", "Carlsbad, CA", "Westminster, CO", "Rochester, MN",
  "Odessa, TX", "Greenwich, CT", "Fairfield, CA", "Elgin, IL", "West Jordan, UT",
  "Clearwater, FL", "Billings, MT", "Cambridge, MA", "South Bend, IN", "High Point, NC",
  "Pueblo, CO", "Hartford, CT", "Waterbury, CT", "Augusta, GA", "Columbus, GA",
  "Savannah, GA", "Athens, GA", "Macon, GA", "Sandy Springs, GA", "Roswell, GA",
  "St. George, UT", "South Jordan, UT", "Layton, UT", "Orem, UT", "Ogden, UT",
  "Salt Lake City, UT", "West Valley City, UT", "West Jordan, UT", "Murray, UT",
  "Bountiful, UT", "Logan, UT", "Draper, UT", "Lehi, UT", "Riverton, UT"
];

interface CityPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function CityPicker({ value, onChange, placeholder = "Select city...", className, id }: CityPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
          id={id}
          data-testid={`city-picker-trigger-${id || 'default'}`}
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {CITIES.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
